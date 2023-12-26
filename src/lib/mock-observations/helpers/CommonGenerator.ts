import { Generator } from '../interfaces';

class CommonGenerator implements Generator {
	private name: String;
	private generateObject: Object;
	
	initialise(name: String, config:Object): void {
		this.name = this.validateName(name);
		// TODO PB -- validate config is not null, not empty and a valid yml object, use yaml.parse(input)
		// TODO PB -- object immutabilty - copy by value here
		this.generateObject = config;
	}

	next(historical: Object[]): Object {
		// TODO PB -- object immutabilty - copy by value here
		return this.generateObject
	}
	
	private validateName(name: String | null): String {
		if (name === null || name.trim() === '') {
			// TODO PB - custom / more specific error?
			throw new Error('name is empty or null');
		}
		return name;
	}
}

export default CommonGenerator;