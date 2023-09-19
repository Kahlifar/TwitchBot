import { Client } from "tmi.js";
import { TmiClient } from "./types/TmiClient";

const loadCommands = require('./loader/commandLoader');
require('dotenv').config();

// Create an instance of your custom client
const client = new TmiClient();

// Now you have a Client instance with custom properties


const PREFIX = client.config.prefix

// Load commands from the commands directory
loadCommands(client);

// Connect to Twitch
client.connect();

console.info(`Loaded ${client.commands.size} commands!`);

// Event handler for incoming messages
client.on('message', (channel, user, message, self) => {
  if (self) return; // Ignore messages from the bot itself

  if (message.startsWith(PREFIX)) {
    const args: String[] = message.slice(PREFIX.length).trim().split(' ');
    if (args && args.length > 0) {
      const commandName: string | undefined = args.shift()?.toLowerCase();
      
      if (commandName) {
        if (client.commands.has(commandName)) {
          const command = client.commands.get(commandName);
  
          // Execute the command
          command.execute(message, channel, user, self, client);
        }
      } else {
        // Handle the case where commandName is undefined or empty
        console.error('commandName is undefined or empty');
      }
    } else {
      // Handle the case where args is undefined or empty
      console.error('args is undefined or empty');
    }
  }
});