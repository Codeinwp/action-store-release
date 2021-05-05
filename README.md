# Action to send release notes to store
Internal GitHub Action for VertigoStudio products to send release notes to store

## Inputs

### `strip_first_lines`

**Required** Strip first X lines from commit message. Default `4`.

### `no_notes`

**Required** Avoid sending notes from the commit message. Default `false`.

## Required Environment Variables

`PRODUCT_ID`        - Product Store id
`AUTH_TOKEN`        - Store Authorization token
`STORE_URL`         - Store URL
`BUILD_VERSION`     - Product new version


## Example usage

uses: Codeinwp/action-store-release@main
with:
strip_first_lines: '4'



## Contributing

#### Requirements
* [act](https://github.com/nektos/act) local runner
* [GH](https://github.com/cli/cli) cli
* [@vercel/ncc](https://github.com/vercel/ncc) as globaly installed package ( `npm i -g @vercel/ncc` )


#### How to test
`act push -j testing ` will run the action using act

For building the dist file, you can use `ncc build index.js --license licenses.txt` or `ncc build index.js --license licenses.txt -w` for watch mode

To simulate a particular event locally you will need an event payload for the type of the event which you are listing. To do this you can use `gh` cli to export API responses

I.e
`gh api /repos/Codeinwp/neve/commits/c3f567031131555dbb38a010d38f01ffa518ca07 >> dev/event.json`

and then use act to test on that event, i.e:

`act push -j testing -e dev/event.json`