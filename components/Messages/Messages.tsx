import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageInfo, ThreadInfo } from "../../constants/types";
import "./Messages.css";
import Navbar from "../Navbar/Navbar";
import { APP_NAME } from "../../constants/globals";
import { io, Socket } from "socket.io-client";
import { flushSync } from "react-dom";
import { useThrottle } from "../../hooks/useThrottle";
import { getThreads, getMessages, addMessage } from "../../api/messages";
import Authorize from "../../api/Auth";
import { UserIdentifier } from "../../constants/types";
import { BASE_URL, ACCESS_KEY } from "../../constants/globals";
import { FileBlobToURL } from "../../utilities/URL";
import Person_Icon from "/person_icon.svg"
import Send_Icon from "/send_icon.svg"

export default function Messages() {
	const token = sessionStorage.getItem(ACCESS_KEY);
	const socket = useMemo<Socket>(() => io(BASE_URL), []);
	const [activeThread, setActiveThread] = useState<string>("");
	const [messages, setMessages] = useState<Array<MessageInfo>>([]);
	const messageContainer = useRef<HTMLDivElement>(null);
	const textInput = useRef<HTMLInputElement>(null);
	const [viewOlder, setViewOlder] = useThrottle<boolean>(false, 100);

	const { data: userIdentifier } = useQuery<UserIdentifier>({
		queryKey: ["auth", { token }],
		queryFn: () => Authorize(token),
	});

	const username = userIdentifier?.username || "";

	const { data: threads } = useQuery<ThreadInfo[]>({
		queryKey: ["threads"],
		queryFn: getThreads,
		initialData: [],
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
		socket.emit("send", { token: token, thread: activeThread, message: value });
		const message: MessageInfo = {
			from: username,
			message: value,
			timeStamp: Date.now(),
		};

		textInput.current!.value = "";
		flushSync(() => {
			setMessages((prev) => [...prev, message]);
		});

		scrollToLastMessage();
	}

	function CreateMessage(index: number, message: MessageInfo) {
		const date = new Date(message.timeStamp).toDateString();

		if (message.from === username) {
			return (
				<div key={index} className="message self-message">
					<p className="message-header">
						You | {date}
					</p>
					<p className="message-content">{message.message}</p>
				</div>
			);
		}
		return (
			<div key={index} className="message">
				<p className="message-header">
					{message.from} | {date}
				</p>
				<p className="message-content">{message.message}</p>
			</div>
		);
	}

	async function ThreadHandler(thread: ThreadInfo) {
		socket.emit("join", thread.threadId);
		socket.emit("leave", activeThread);
		const currentMessages = await getMessages(thread.threadId);

		flushSync(() => {
			setMessages(currentMessages);
			setActiveThread(thread.threadId);
		});

		const element = messageContainer.current!;
		const scrollHeight = element.scrollHeight;

		setViewOlder(false);
		element.scrollTo(0, scrollHeight);
	}

	function listener(response: MessageInfo) {
		const message: MessageInfo = {
			from: response.from,
			message: response.message,
			timeStamp: response.timeStamp,
		};

		flushSync(() => {
			setMessages((prev) => [...prev, message]);
		});

		if (!viewOlder) scrollToLastMessage();
	}

	useEffect(() => {
		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		socket.on("receive", listener);
		textInput.current!.addEventListener("keypress", EnterMessage);

		return () => {
			socket.off("receive", listener);
			textInput.current?.removeEventListener("keypress", EnterMessage);
		};
	}, [viewOlder, activeThread]);

	return (
		<div id={"messages-page"}>
			<Helmet>
				<title>Messages | {APP_NAME}</title>
				<meta name="description" content="Your Private Messages" />
			</Helmet>
			<Navbar />
			<div className="container">
				<div className="threads-container">
					{threads.map((thread: ThreadInfo) => {
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
						{messages.length > 0 &&
							messages.map((message, index) => CreateMessage(index, message))}
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
