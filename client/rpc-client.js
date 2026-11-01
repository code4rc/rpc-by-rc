const RPC = require("discord-rpc");

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!CLIENT_ID) {
  console.error("Discord Client ID missing!");
  process.exit(1);
}

const rpc = new RPC.Client({ transport: "ipc" });

rpc.on("ready", () => {
  console.log("RPC BY RC Connected!");

  rpc.setActivity({
    details: "Custom RPC By RC",
    state: "Discord Rich Presence",
    largeImageKey: "logo",
    largeImageText: "RPC BY RC",
    instance: false
  });

  console.log("Rich Presence Activated!");
});

rpc.login({ clientId: CLIENT_ID }).catch(console.error);
