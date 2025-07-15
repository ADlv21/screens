import { Polar } from '@polar-sh/sdk'

const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN_SANDBOX,
    server: 'sandbox',
});

export default polar;