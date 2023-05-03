import { CommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface Command {
    data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand"> | ContextMenuCommandBuilder| SlashCommandSubcommandsOnlyBuilder;
    run: (interaction: CommandInteraction | ContextMenuCommandInteraction) => Promise<void>;
}
