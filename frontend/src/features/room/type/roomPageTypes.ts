import { RoomsDto } from "./room";

export interface RoomWithMembers extends RoomsDto {
  members?: RoomMember[];
}

export interface RoomMember {
  id: number;
  userId: number;
  username: string;
  profileImage?: string;
  role: "OWNER" | "MEMBER";
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}
