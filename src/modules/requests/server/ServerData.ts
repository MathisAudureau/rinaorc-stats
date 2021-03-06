import { Server } from 'App/modules/requests/server/Server'
import axios, { AxiosResponse } from 'axios'
import { RequestManager } from 'App/modules/requests/RequestManager'
import { createEmbed } from 'App/components/embeds'
import { CommandInteraction, MessageEmbed } from 'discord.js'

const config = require('../../../config.json')

export class ServerData {
  private servers: Array<Server> = []

  public async registerServer(interaction: CommandInteraction): Promise<void> {
    const serverData: AxiosResponse<any> = await axios({
      url: `https://api.rinaorc.com/stats/players`,
      method: 'GET',
      headers: {
        'API-Key': RequestManager.getToken()
      }
    })

    const informationEmbed: MessageEmbed = createEmbed(`Informations des serveurs`, "Informations sur le nombre de connectés de chaques serveurs.")

    for (let dataKey in serverData.data["games"]) {
      this.servers.push({
        server: dataKey,
        players: serverData.data["games"][dataKey]["players"]
      })
      informationEmbed.addField(`Serveur ${dataKey}`, `${serverData.data["games"][dataKey]["players"]} joueurs`, true)
        .setThumbnail(config.embeds.rinaorc)
    }

    await interaction.reply({
      embeds: [informationEmbed],
      ephemeral: true
    })
  }
}
