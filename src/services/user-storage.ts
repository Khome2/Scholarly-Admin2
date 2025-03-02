import { Admin } from "../interfaces/Admin";
import { Channel } from "../interfaces/Channel";
import { Chat } from "../interfaces/Chat";
import { Notification } from "../interfaces/Notification";

export function saveAdminUserData(data:Admin){
    localStorage.setItem('userdata', JSON.stringify(data))
}

export function saveCallToken(token: string){
    localStorage.setItem('call-token', token);
}

export function getCallToken():string | undefined{
    return (localStorage.getItem('call-token') as string | undefined);
}

export function hasAdminUserData():boolean{
    const rawData = localStorage.getItem('userdata');

    return rawData !== null;
}

export function getAdminUserData(): Admin{

    const rawData = localStorage.getItem('userdata');

    return JSON.parse(rawData!) as Admin;
}

export function saveChannels(channels: Channel[]){
    localStorage.setItem('channels', JSON.stringify(channels));
}

export function getChannels() : Channel[]{
    return JSON.parse(localStorage.getItem('channels') ?? '[]');
}

export function getChannel(channelId:string): Channel | undefined | null{
    return getChannels().find(channel => channelId === channel.id);
}

export function saveChats(channelId:string, chats: Chat[]){
    localStorage.setItem(`chats:${channelId}`, JSON.stringify(chats));
}

export function getChats(channelId): Chat[]{
    return JSON.parse(localStorage.getItem(`chats:${channelId}`) ?? '[]');
}

export function saveNotifications (notifications: Notification[]){
    localStorage.setItem("notifications", JSON.stringify(notifications))
}

export function getNotifications(): Notification[]{
    return JSON.parse(localStorage.getItem('notifications') ?? '[]');
}

export function clearAdminUserData() {
    localStorage.removeItem('userdata');
}

