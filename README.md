# Impact Framework - Unofficial Plugins

## Implementations

- [Azure Importer](./src/lib/azure-importer/README.md)
- [Boavizta](./src/lib/boavizta/README.md)
- [CCF](./src/lib/ccf/README.md)
- [CO2.JS](./src/lib/co2js/README.md)
- [Teads AWS](./src/lib/teads-aws/README.md)
- [Teads TDP Curve](./src/lib/teads-curve/README.md)
- [Watt Time](./src/lib/watt-time/README.md)

## Test Kepler in development

```bash
npm run build

# This step will override the @grnsft/if-unofficial-plugins package with this repository content
npm link

ie --manifest kepler-manifest.yml
```

## Contributing

See contributing rules [here](./CONTRIBUTING.md).
