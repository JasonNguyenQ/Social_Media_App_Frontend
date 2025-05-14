import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { MessageInfo, MessageReaction, MessageReactionCounts, MessageReactions, Reactions, ThreadInfo } from "../../constants/types";
import "./Messages.css";
import Navbar from "../Navbar/Navbar";
import { APP_NAME } from "../../constants/globals";
import { io, Socket } from "socket.io-client";
import { flushSync } from "react-dom";
import { useThrottle } from "../../hooks/useThrottle";
import { getThreads, getMessages, addMessage } from "../../api/messages";
import { CreateReaction, DeleteReaction, GetThreadReactionCounts, GetThreadReactions } from "../../api/reactions";
import { UserIdentifier } from "../../constants/types";
import { BASE_URL, ACCESS_KEY } from "../../constants/globals";
import { FileBlobToURL } from "../../utilities/URL";
import Person_Icon from "/person_icon.svg"
import Send_Icon from "/send_icon.svg"
import Love_Icon from "/love_icon.svg"
import Like_Icon from "/like_icon.svg"
import Filled_Love_Icon from "/filled_love_icon.svg"
import Filled_Like_Icon from "/filled_like_icon.svg"
import { NumericalAbbr } from "../../utilities/Abbreviation";

const iconMap = {
	Like: Filled_Like_Icon,
	Love: Filled_Love_Icon
}

export default function Messages() {
	const token = sessionStorage.getItem(ACCESS_KEY);
	const [activeThread, setActiveThread] = useState<string>("");
	const [activeMessage, setActiveMessage] = useState<number>(-1);
	const messageContainer = useRef<HTMLDivElement>(null);
	const textInput = useRef<HTMLInputElement>(null);
	const reactionBar = useRef<HTMLDivElement>(null);
	const [viewOlder, setViewOlder] = useThrottle<boolean>(false, 100);
	const queryClient = useQueryClient()
	const userIdentifier : UserIdentifier | undefined = queryClient.getQueryData(["auth", { token }])

	const username = userIdentifier?.username || "";

	const [
		{ data: threads },
		{ data: nThreadReactions },
		{ data: threadReactions },
		{ data: messages },
		{ data: socket },
	] :
	[
		{ data: ThreadInfo[] },
		{ data: MessageReactionCounts },
		{ data: MessageReactions },
		{ data: MessageInfo[] },
		{ data: Socket },
	] = useQueries({
		queries: [
			{
				queryKey: ["threads"],
				queryFn: async () => await getThreads(),
			},
			{
				queryKey: ["nThreadReactions", {activeThread}],
				queryFn: async () => await GetThreadReactionCounts(activeThread),
			},
			{
				queryKey: ["ThreadReactions", {activeThread}],
				queryFn: async () => await GetThreadReactions(activeThread),
			},
			{
				queryKey: ["messages", {activeThread}],
				queryFn: async () => await getMessages(activeThread),
			},
			{
				queryKey: ["socket", {token}],
				queryFn: ()=>io(BASE_URL, {query: `token=${token}` as any}),
				staleTime: Infinity
			}
		]
	});
	
	function HandleScroll() {
		const element = messageContainer.current!;
		const scrollHeight = element.scrollHeight;
		const elementHeight = element.clientHeight;
		const scrollTop = element.scrollTop;
		const length = Math.min(5, element.children.length);
		let childHeights = 0;

		for (let i = 0; i < length; i++) {
			const child = element.children.item(element.children.length - 1 - i)!;
			childHeights +=
				child.clientHeight + parseFloat(getComputedStyle(child).marginBottom);
		}

		setViewOlder(!(scrollHeight - (elementHeight + scrollTop) <= childHeights));
	}

	function scrollToLastMessage() {
		messageContainer.current!.lastElementChild?.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	}

	function EnterMessage(e: KeyboardEvent) {
		if (e.key === "Enter") SendMessage();
	}	

	async function SendMessage() {
		const value = textInput.current!.value;
		if (value === "") return;
		await addMessage({ threadId: activeThread, message: value });
		socket.emit("send", { message: value });
		const message: MessageInfo = {
			from: username,
			message: value,
			timeStamp: Date.now(),
			threadId: activeThread
		};

		textInput.current!.value = "";
		queryClient.setQueryData(["messages", {activeThread}], (prev: MessageInfo[])=> [...prev, message])
	}

	function CreateMessage(index: number, message: MessageInfo) {
		const date = new Date(message.timeStamp).toDateString();
		const reactions : MessageReaction = nThreadReactions?.[message.messageId!] || {}

		return (
			<div key={index} className={`message ${message.from === username && "self-message"}`} data-messageid={message.messageId}>
				<p className="message-header">
					{(message.from === username) ? "You" : message.from} | {date}
				</p>
				<div className="message-content">
					{message.message}
					<div className="message-reactions">
						{Object.entries(reactions).map(([reaction,count], index)=>{
							const key = reaction as keyof typeof iconMap;
							const countAbbr = NumericalAbbr(count)
							return (
								<span 
									className="message-reaction"
									data-count={countAbbr}
									key={index}
									style={{
										"--position": `${index}`,
										"--amount": `${Object.values(reactions).length}`,
										"--width": `${countAbbr.length + 1}ch`
									} as React.CSSProperties}
									>
									<img src={iconMap[key]}/>
								</span>
							)
						})}
					</div>
				</div>
			</div>
		);
	}

	async function ThreadHandler(thread: ThreadInfo) {
		socket.emit("join", thread.threadId);

		flushSync(() => {
			setActiveThread(thread.threadId);
		});

		const element = messageContainer.current!;
		const scrollHeight = element.scrollHeight;

		setViewOlder(false);
		element.scrollTo(0, scrollHeight);
	}

	async function ReactionHandler(messageId: number, reaction: Reactions){
		if(threadReactions?.[messageId]?.includes(reaction)){
			DeleteReaction({type: "message", id: activeMessage, reaction: reaction})
			const updatedThreadReactions = {...threadReactions, [messageId]: threadReactions?.[messageId].filter((r)=>{
				return r !== reaction
			})}
			queryClient.setQueryData(["ThreadReactions", {activeThread}], 
				updatedThreadReactions
			)

			const updatedNThreadReactions = 
			{
				...nThreadReactions, 
				[messageId]: {
					...nThreadReactions?.[messageId], 
					[reaction]: (nThreadReactions?.[messageId]?.[reaction] || 1) - 1
				}
			}
			if(updatedNThreadReactions?.[messageId]?.[reaction] === 0) 
				delete updatedNThreadReactions?.[messageId]?.[reaction]
			queryClient.setQueryData(["nThreadReactions", {activeThread}], updatedNThreadReactions)
		}
		else{
			CreateReaction({type: "message", id: activeMessage, reaction: reaction})
			const updatedThreadReactions = 
			{...threadReactions, [messageId]: [...(threadReactions?.[messageId] || []), reaction]}
			queryClient.setQueryData(["ThreadReactions", {activeThread}], 
				updatedThreadReactions
			)

			const updatedNThreadReactions = 
			{
				...nThreadReactions, 
				[messageId]: {
					...nThreadReactions?.[messageId], 
					[reaction]: (nThreadReactions?.[messageId]?.[reaction] || 0) + 1
				}
			}
			queryClient.setQueryData(["nThreadReactions", {activeThread}], updatedNThreadReactions)
		}
	}

	function listener(response: MessageInfo) {
		const message: MessageInfo = {
			from: response.from,
			message: response.message,
			timeStamp: response.timeStamp
		};

		queryClient.setQueryData(["messages", {activeThread: response.threadId}], (prev: MessageInfo[])=> [...(prev||[]), message])
	}

	useEffect(() => {
		const activeThread = sessionStorage.getItem("activeThread")
		if(activeThread){
			socket.emit("join", activeThread);
			setActiveThread(activeThread)
		}
		function handleReactionBar(){
			const bar = reactionBar.current
			if(bar) bar.style.display = "none"
		}	
		document.addEventListener("click", handleReactionBar)

		return ()=>{
			document.removeEventListener("click", handleReactionBar)
		}
	}, []);

	useEffect(()=>{
		const messages = document.querySelectorAll(".message-content")
		const listeners = new Array(messages.length)
		document.querySelectorAll(".message-content").forEach((p, index)=>{
			function ReactionMenu(e: Event){
				e.preventDefault()
				const message = p.parentElement
				const bar = reactionBar.current
				if(bar && !message?.classList.contains("self-message")){
					setActiveMessage(Number(message?.getAttribute("data-messageid")))
					message?.appendChild(reactionBar.current)
					bar.style.display = "flex"
				}
			}
			listeners[index] = ReactionMenu
			p.addEventListener("contextmenu", ReactionMenu)
		})

		return ()=>{
			document.querySelectorAll(".message-content").forEach((p, index)=>{
				p.removeEventListener("contextmenu", listeners[index])
			})
		}
	})

	useEffect(() => {
		sessionStorage.setItem("activeThread", activeThread)
		socket?.on("receive", listener);
		textInput.current!.addEventListener("keypress", EnterMessage);

		return () => {
			socket?.off("receive", listener);
			textInput.current?.removeEventListener("keypress", EnterMessage);
		};
	}, [viewOlder, activeThread]);

	useEffect(()=>{
		if (!viewOlder || messages?.at(-1)?.from === username) scrollToLastMessage();
	},[messages])

	return (
		<div id={"messages-page"}>
			<Helmet>
				<title>Messages | {APP_NAME}</title>
				<meta name="description" content="Your Private Messages" />
			</Helmet>
			<Navbar />
			<div id="reaction-menu" ref={reactionBar} style={{display: "none"}}>
				<img 
					src={
						(threadReactions?.[activeMessage]?.includes("Like")) ? 
						Filled_Like_Icon : Like_Icon
					} 
					onClick={()=>{ReactionHandler(activeMessage, "Like")}}
				/>
				<img 
					src={
						(threadReactions?.[activeMessage]?.includes("Love")) ? 
						Filled_Love_Icon : Love_Icon
					} 
					onClick={()=>{ReactionHandler(activeMessage, "Love")}}
				/>
			</div>
			<div className="container">
				<div className="threads-container">
					{threads?.map((thread: ThreadInfo) => {
						return (
							<div
								key={thread.threadId}
								className={`thread ${
									activeThread === thread.threadId ? "active-thread" : ""
								}`}
								onClick={() => {
									ThreadHandler(thread);
								}}
							>
								<img src={FileBlobToURL(thread.threadIcon, Person_Icon)} alt="thread icon"/>
								{thread.threadName}
							</div>
						);
					})}
				</div>
				<div className="message-container">
					<div
						className="messages"
						ref={messageContainer}
						onScroll={HandleScroll}
					>
						{messages?.map((message, index) => CreateMessage(index, message))}
					</div>
					<div className="message-field">
						<input
							name="messageInput"
							autoComplete="off"
							ref={textInput}
							type="text"
							placeholder="Send Message..."
							maxLength={2000}
						></input>
						<button onClick={SendMessage}><img src={Send_Icon} alt="Send"/></button>
					</div>
					<button hidden={!viewOlder} onClick={scrollToLastMessage}>
						View Recent...
					</button>
				</div>
			</div>
		</div>
	);
}
