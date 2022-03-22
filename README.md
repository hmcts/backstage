# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app:
1. Setup these environment variables
   ```shell
    export AUTH_MICROSOFT_TENANT_ID=get this
    export AUTH_MICROSOFT_CLIENT_ID=get this
    export AUTH_MICROSOFT_CLIENT_SECRET=get this
    export POSTGRES_PASSWORD=postgres
    export POSTGRES_USER=postgres
    export AUTH_GITHUB_CLIENT_ID=get this
    export AUTH_GITHUB_CLIENT_SECRET=get this
    export GITHUB_TOKEN=get this
    export JENKINS_USERNAME="test"
    export JENKINS_API_KEY="123"
    ```

2. Start a postgres db: `docker run -d -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e POSTGRES_HOST_AUTH_METHOD=trust -p 5432:5432 postgres`
3. `yarn install`
4. `yarn dev`
