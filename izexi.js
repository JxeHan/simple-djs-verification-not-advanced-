const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const colors = require('colors');
const config = require("./config");
const processUtils = require('./utils/process');
const client = new Discord.Client({ intents: 3276799 });
processUtils();

client.on("ready", async () => {
    console.log(`Logged in as: ${client.user.username.green}`);
});

const roleId = config.role; // Replace with your role ID
client.on('messageCreate', async message => {
  if (message.content === '!v') {
    const guild = message.guild;
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setDescription('Click the button below to get verified.')
      .setAuthor({ name: `${guild.name} - Verification`, iconURL: guild.iconURL() });

    const button = new ButtonBuilder()
      .setCustomId('verify')
      .setLabel('Verify')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'verify') {
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const role = interaction.guild.roles.cache.get(roleId);

    if (role) {
      await member.roles.add(role);
      await interaction.reply({ content: 'You have been verified.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Role not found. Please contact an administrator.', ephemeral: true });
    }
  }
});

client.login(token);
