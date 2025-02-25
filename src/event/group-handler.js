import moment from 'moment-timezone';
import config from '../../config.cjs';

export default async function GroupParticipants(sock, { id, participants, action }, m) {
   try {
      const metadata = await sock.groupMetadata(id);

      for (const jid of participants) {
         let profile;
         try {
            profile = await sock.profilePictureUrl(jid, "image");
         } catch {
            profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu";
         }

         if (action == "add" && config.WELCOME) {
            const userName = jid.split("@")[0];
            const joinTime = moment.tz('Africa/Nairobi').format('HH:mm:ss');
            const joinDate = moment.tz('Africa/Nairobi').format('DD/MM/YYYY');
            const membersCount = metadata.participants.length;

            sock.sendMessage(id, {
               text: `> Hello @${userName}! Welcome to *${metadata.subject}*.\n> You are the ${membersCount}th member.\n> Joined at: ${joinTime} on ${joinDate}`,
               contextInfo: {
                  mentionedJid: [jid],
                  quotedMessage: m.message,
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                     newsletterJid: '120363286758767913@newsletter',
                     newsletterName: 'RCD-MD FORWARD',
                     serverMessageId: 143,
                  },
               }
            });
         } else if (action == "remove" && config.WELCOME) {
            const userName = jid.split('@')[0];
            const leaveTime = moment.tz('Africa/Nairobi').format('HH:mm:ss');
            const leaveDate = moment.tz('Africa/Nairobi').format('DD/MM/YYYY');
            const membersCount = metadata.participants.length;

            sock.sendMessage(id, {
               text: `> Goodbye @${userName} from ${metadata.subject}.\n> We are now ${membersCount} in the group.\n> Left at: ${leaveTime} on ${leaveDate}`,
               contextInfo: {
                  mentionedJid: [jid],
                  quotedMessage: m.message,
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                     newsletterJid: '120363286758767913@newsletter',
                     newsletterName: 'RCD-MD FORWARD',
                     serverMessageId: 143,
                  },
               }
            });
         }
      }
   } catch (e) {
      throw e;
   }
}
