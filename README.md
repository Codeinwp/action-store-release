# Action to send release notes to store
Internal GitHub Action for VertigoStudio products to send release notes to store


##Contributing

####Requirements
* [act](https://github.com/nektos/act) local runner
* [GH](https://github.com/cli/cli) cli
* [@vercel/ncc](https://github.com/vercel/ncc) as globaly installed package ( `npm i -g @vercel/ncc` )


####How to test
`act push -j testing ` will run the action using act

For building the dist file, you can use `ncc build index.js --license licenses.txt` or `ncc build index.js --license licenses.txt -w` for watch mode

To simulate a particular event locally you will need an event payload for the type of the event which you are listing. To do this you can use `gh` cli to export API responses

I.e
`gh api /repos/Codeinwp/neve/commits/c3f567031131555dbb38a010d38f01ffa518ca07 >> dev/event.json`

and then use act to test on that event, i.e:

`act push -j testing -e dev/event.json`