all: clean create
create:
	node createdb.js
test:
	node testdb.js
clean:
	rm sfcs.db -f
