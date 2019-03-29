export default class Graph {
  constructor() {
    this.adjList = new Map();
    this.visited = [];
  }

  addVertex(v) {
    // initialize the adjacent list with a
    // null array
    this.adjList.set(v, []);
    this.visited.push(false);
  }

  addEdge(v, w) {
    // get the list for vertex v and put the
    // vertex w denoting edge betweeen v and w
    this.adjList.get(v).push(w);

    // Since graph is undirected,
    // add an edge from w to v also
    this.adjList.get(w).push(v);
  }

  printGraph() {
    this.adjList.forEach((value, key) => {
      const getValues = this.adjList.get(key);
      let conc = '';
      getValues.forEach((elem) => {
        conc += `${elem} `;
      });
      console.log(`${key} -> ${conc}`);
    });
  }
}
