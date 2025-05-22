export type FileBlob = {
  data: Array<number>
  buffer: Buffer
}

export type ProfileProps = {
	id?: number,
	username: string;
	backgroundImage?: FileBlob;
	profilePicture?: FileBlob;
	firstName: string;
	lastName: string;
	followers?: number;
	following?: number;
	description?: string;
};

export type MessageInfo = {
	messageId?: number;
	threadId?: string;
	from: string;
	message: string;
	timeStamp: number;
};


export type Reactions = "Like" | "Love"

export type ContentIdentifier = {
	contentType: string;
	contentId: number;
}

export type ContentReaction = ContentIdentifier & { reaction: Reactions }

export type MessageReaction = {
	[key in Reactions]?: number
}
export type MessageReactionCounts = Record<number, MessageReaction>
export type MessageReactions = Record<number, Array<Reactions>>

export type ThreadInfo = {
	threadId: string;
	threadName: string;
	threadIcon: FileBlob;
};

export type UserIdentifier = {
	id: number;
	username: string;
};

export type PostProps = {
	postId: number,
	id: number;
	profilePicture?: FileBlob;
	from: string;
	title: string;
	image?: FileBlob;
	caption: string;
	createdAt: number;
}

export type CommentProps = {
	id: number;
	profilePicture?: FileBlob;
	from: string;
	comment: string;
	createdAt: number;
}