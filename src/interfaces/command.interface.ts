import { CommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Command {
    data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand"> | ContextMenuCommandBuilder;
    run: (interaction: CommandInteraction | ContextMenuCommandInteraction) => Promise<void>;
}
