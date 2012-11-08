extension: true
properties:
	startsWith: (s) -> @slice(0,s.length) is s
	endsWith: (s) -> @slice(-s.length) is s
	contains: (s) -> @indexOf(s) >= 0
	toArray: () -> @split ''