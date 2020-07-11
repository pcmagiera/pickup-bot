import Discord from 'discord.js';
import Bot from './bot';

export interface Config {
    bot: {
        token: string
    };
    db: {
        server: string;
        user: string;
        password: string;
        db: string;
    };
    settings: {
        MAX_GLOBAL_EXPIRE: string;
        MAX_WARN_STREAKS: string;
        MAX_WARN_STREAK_EXPIRATION_TIME: string;
        MAX_WARN_EXPIRATION_TIME: string;
        MAX_WARN_BANTIME: string;
        MAX_WARN_BANTIME_MULTIPLIER: string;
    }
};

interface DefaultValue {
    type: 'string' | 'number';
    name: string;
    desc: string;
    value: string | number;
    possibleValues: number[] | string[] | { from: number; to: number };
}

export interface Command {
    cmd: string;
    aliases?: string[];
    shortDesc: string;
    desc: string;
    args?: CommandArgument[];
    perms: boolean;
    global: boolean;
    defaults?: DefaultValue[];
    exec: (bot: Bot, message: Discord.Message, params: any[], defaults?: any[]) => any;
}

export interface CommandArgument {
    name: string;
    desc: string;
    required: boolean;
}

export type ChannelType = 'pickup' | 'pickup-info' | 'listen';

export interface ValidationError {
    type: string;
    errorMessage: string;
}

export type TimeError = 'exceeded' | 'subceeded' | 'invalid';

export interface PickupSettings {
    id: number;
    name: string;
    playerCount: number;
    teamCount: number;
    isDefaultPickup: boolean;
    mapPoolId: number | null;
    afkCheck: boolean;
    pickMode: 'no_teams' | 'manual' | 'elo';
    whitelistRole: bigint | null;
    blacklistRole: bigint | null;
    promotionRole: bigint | null;
    captainRole: bigint | null;
    serverId: number | null;
}

export interface PickupInfo {
    id: number;
    name: string;
    startedAt: Date;
    playerNicks: String[];
}

export interface PlayerNicks {
    oldNick: boolean;
    players: { oldNick?: string; currentNick: string; id: number; userId: BigInt }[]
}