// @ts-check

const rootPkg = require('./package.json');

console.log(`Checking for package peerDependency overrides`);

const remapPeerDependencies = [
  {
    package: 'next-auth',
    packageVersion: '5.0.0-beta',
    peerDependency: '@auth/core',
    newVersion: '0.37.4'
  }
];

function overridesPeerDependencies(pkg) {
  if (pkg.peerDependencies) {
    remapPeerDependencies.map((dep) => {
      if (
        pkg.name === dep.package &&
        pkg.version.startsWith(dep.packageVersion)
      ) {
        console.log(`  - Checking ${pkg.name}@${pkg.version}`);

        if (dep.peerDependency in pkg.peerDependencies) {
          try {
            console.log(
              `    - Overriding ${pkg.name}@${pkg.version} peerDependency ${dep.peerDependency}@${pkg.peerDependencies[dep.peerDependency]}`
            );

            // Create dependency and remove peer dependency
            if (!pkg.dependencies) {
              pkg.dependencies = {};
            }
            pkg.dependencies[dep.peerDependency] = dep.newVersion;
            delete pkg.peerDependencies[dep.peerDependency];

            console.log(
              `      - Overrode ${pkg.name}@${pkg.version} peerDependency ${dep.peerDependency}@${pkg.dependencies[dep.peerDependency]}`
            );
          } catch (err) {
            console.error(err);
          }
        }
      }
    });
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage(pkg, _context) {
      overridesPeerDependencies(pkg);
      return pkg;
    }
  }
};
