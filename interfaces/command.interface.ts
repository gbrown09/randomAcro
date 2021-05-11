import { Client, CommandInteraction, Message } from 'discord.js';

export interface Command {
    name: string;
    description: string;
    strArgs: string[];

    executeCommand(message: Message, args?: string[], bot?: Client): Promise<void>;
    executeSlashCommand(interaction: CommandInteraction, bot?: Client): Promise<void>;
}
