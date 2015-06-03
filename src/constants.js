import constantCase from 'constant-case';
import {METHODS, STATUSES} from 'flux-resource-core/lib/config';
import {createConstants} from 'marty';

export default function generateConstants() {
  const {methodNames} = this;

  const constantNames = Object.keys(this.methodNames).map(
      method => constantCase(methodNames[method])
  );
  const constants = createConstants(constantNames);

  const constantMappings = {};

  METHODS.forEach(function mapMethodConstants(method) {
    const methodName = methodNames[method];
    const methodConstantMappings = {};
    constantMappings[method] = methodConstantMappings;

    STATUSES.forEach(function mapStatusConstants(status) {
      const statusName = status === 'starting' ? '' : status;
      const constantName = constantCase(`${methodName} ${statusName}`);

      methodConstantMappings[status] = constants[constantName];
    });
  });

  return {constants, constantMappings};
}
