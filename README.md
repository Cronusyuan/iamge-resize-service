# Image resizing service

## Deploying

- run `nvm use`

- run `npm run deploy` (specify `--stage {stage}`/ `--region {region}` if you want to customize them)

It will:

1. Install the linux version for the `sharp` package. Refer to [`sharp` docs](https://sharp.pixelplumbing.com/install#aws-lambda)
2. Deploy the stack using `serverless deploy`
