import { ChatInputCommandInteraction, ContextMenuCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { Client, CommandInteraction, ContextMenuCommandInteraction, Message } from 'discord.js';

export interface Command {
    data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand"> | ContextMenuCommandBuilder;
    run: (interaction: CommandInteraction | ContextMenuCommandInteraction) => Promise<void>;
}
