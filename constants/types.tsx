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
	from: string;
	message: string;
	timeStamp: number;
};

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