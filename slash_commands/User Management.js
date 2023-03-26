const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { BotIcon, BotName, BotNameLink, CommandLogs, OwnerID } = require('../Database/Information.json');

module.exports = {
    name:"user-management",
    data: new SlashCommandBuilder()
    .setName("user-management")
    .setDescription("Allows you to Manage a Discord User")
    .addStringOption(option => option.setName('type').setDescription('Type of Command to use on User')
    .addChoices(
        {"name": "Ban", "value": "ban"},
        {"name": "Unban", "value": "unban"},
        {"name": "Kick", "value": "kick"}, 
        {"name": "View Profile", "value": "viewprofile"}, 
    ).setRequired(true))
    .addUserOption(option => option.setName('user').setDescription('Enter user Name').setRequired(true))
    .addStringOption(option => option.setName('option_1').setDescription('Reason')),

run: async (client, interaction) => { 

            //FETCHING OPTIONS/CHOICES
            const targetNamed = interaction.options.getUser('user');
            const option = interaction.options.getString('type');
            optional = interaction.options.getString('option_1');
            if(optional === null){ optional = 'none' }
            const channel = client.channels.cache.get(CommandLogs);

            //MASS USED ERROR EMBEDS
            const ownererror = new EmbedBuilder()
            .setTitle("Error!")
            .setAuthor({ name: BotName, iconURL: BotIcon, url: BotNameLink })
            .setDescription(`Hey <@!${interaction.user.id}>, You can't use this on the Owner!`)
            .setTimestamp()
            .setThumbnail(BotIcon)

            const roleordererror = new EmbedBuilder()
            .setTitle("Error!")
            .setAuthor({ name: BotName, iconURL: BotIcon, url: BotNameLink })
            .setDescription(`Hey <@!${interaction.user.id}>, That Interaction Failed! \nPlease make sure you have the Bot Role at the Top!`)
            .setTimestamp()
            .setThumbnail(BotIcon)

            const permissionerror = new EmbedBuilder()
            .setTitle("Error!")
            .setAuthor({ name: BotName, iconURL: BotIcon, url: BotNameLink })
            .setDescription(`Hey <@!${interaction.user.id}>, You don't have permission to use this!`)
            .setTimestamp()
            .setThumbnail(BotIcon)

            //MAIN COMMANDS FILTERING THROUGH TYPES AND USER PERMISSIONS
            if(option === 'ban'){

            //PREVENT USAGE ON OWNER
            if(targetNamed.id === OwnerID){ 
                return interaction.followUp({ embeds: [ownererror] }) 
            }

                if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)){     
                    return interaction.followUp({ embeds: [permissionerror] });
                } else {

                    interaction.guild.members.ban(targetNamed).catch(error => {
                        if(error.message === 'Missing Permissions') return interaction.followUp({ embeds: [roleordererror] })
                    })

                    const banned = new EmbedBuilder()
                    .setTitle("User Banned!")
                    .setAuthor({ name: BotName, iconURL: BotIcon, url: BotNameLink })
                    .setDescription(`This User has been Banned`)
                    .addFields({ name:'Name:', value:`${targetNamed}`, inline: true})
                    .addFields({ name:'ID:', value:`${targetNamed.id}`, inline: true})
                    .addFields({ name:'Reason', value:`${optional}`})
                    .addFields({ name:'Banned By:', value: `${interaction.user.tag}`})
                    .setTimestamp()
                    .setThumbnail(targetNamed.avatarURL({ dynamic: true, size: 2048 }))
                    return channel.send({ embeds: [banned] }) & interaction.followUp({ embeds: [banned] })
                }
            }
            if(option === 'unban'){

            //PREVENT USAGE ON OWNER
            if(targetNamed.id === OwnerID){ 
                return interaction.followUp({ embeds: [ownererror] }) 
            }

                if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)){     
                    return interaction.followUp({ embeds: [permissionerror] });
                } else {

                    interaction.guild.members.unban(targetNamed).catch(error => {
                        if(error.message === 'Missing Permissions') return interaction.followUp({ embeds: [roleordererror] })
                    })

                    const unbanned = new EmbedBuilder()
                    .setTitle("User Banned!")
                    .setAuthor({ name: BotName, iconURL: BotIcon, url: BotNameLink })
                    .setDescription(`This User has been Unbanned`)
                    .addFields({ name:'Name:', value:`${targetNamed}`, inline: true})
                    .addFields({ name:'ID:', value:`${targetNamed.id}`, inline: true})
                    .addFields({ name:'Unbanned By:', value: `${interaction.user.tag}`})
                    .setTimestamp()
                    .setThumbnail(targetNamed.avatarURL({ dynamic: true, size: 2048 }))
                    return channel.send({ embeds: [unbanned] }) & interaction.followUp({ embeds: [unbanned] })
                }
            }
            if(option === 'kick'){

            //PREVENT USAGE ON OWNER
            if(targetNamed.id === OwnerID){ 
                return interaction.followUp({ embeds: [ownererror] }) 
            }

                if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)){     
                    return interaction.followUp({ embeds: [permissionerror] });
                } else {

                    interaction.guild.members.ban(targetNamed).catch(error => {
                        if(error.message === 'Missing Permissions') return interaction.followUp({ embeds: [roleordererror] })
                    })

                    const kicked = new EmbedBuilder()
                    .setTitle("User Kicked!")
                    .setAuthor({ name: BotName, iconURL: BotIcon, url: BotNameLink })
                    .setDescription(`This User has been Kicked`)
                    .addFields({ name:'Name:', value:`${targetNamed}`, inline: true})
                    .addFields({ name:'ID:', value:`${targetNamed.id}`, inline: true})
                    .addFields({ name:'Reason', value:`${optional}`})
                    .addFields({ name:'Kicked By:', value: `${interaction.user.tag}`})
                    .setTimestamp()
                    .setThumbnail(targetNamed.avatarURL({ dynamic: true, size: 2048 }))
                    return channel.send({ embeds: [kicked] }) & interaction.followUp({ embeds: [kicked] })
                }
            }
            if(option === 'viewprofile'){

                const profile = new EmbedBuilder()
                .setTitle("User Profile!")
                .setAuthor({ name: BotName, iconURL: BotIcon, url: BotNameLink })
                .addFields({ name:'Name:', value:`${targetNamed} \n(${targetNamed.username}#${targetNamed.discriminator})`, inline: true})
                .addFields({ name:'ID:', value:`${targetNamed.id}`, inline: true})
                .setTimestamp()
                .setThumbnail(targetNamed.avatarURL({ dynamic: true, size: 2048 }))
                await interaction.followUp({ embeds: [profile] })
            }
}
}