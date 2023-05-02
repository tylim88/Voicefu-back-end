# Voice Synthesis

[front end code and intro](https://github.com/tylim88/Voicefu)

## Development Mode

1. This project use Firebase Firestore, please enable it in Firebase Console
2. Create a `dev.env.json` file at project root and paste:

    ```json
    {
        "firebase": {
            "type": "service_account",
            "project_id": "?",
            "private_key_id": "?",
            "private_key": "?",
            "client_email": "?",
            "client_id": "?",
            "auth_uri": "?",
            "token_uri": "?",
            "auth_provider_x509_cert_url": "?",
            "client_x509_cert_url": "?"
        },
        "openAI": { "key": "?" },
        "cors": ["http://127.0.0.1/:5173"],
        "production": false,
        "email": "does not matter in dev mode"
    }
    ```

3. Fill in the `?` with Firebase service account and openai api key. Do note that they are secrets.

4. Install docker and start docker.

5. Run `npm run docker`, this will download Voicevox image(first time) and run Voicevox container.

6. Open a new terminal and run `npm run dev` to start the server.

## Production Mode

The repo is ready for production, but you will probably go with your tech stack anyway.

Open an issue if you really need one, and I will complete this read me.
