export default function() {
  this.get('/visits', function() {
    return {
      visits: [{
        id: "abcd",
        active: true,
        host: "localhost",
        visited_at: 1,
        duration: 2000
      }, {
        id: 5,
        host: "www.spiegel.de",
        visited_at: 1356776234236,
        active: true,
        duration: 2000
      }, {
        id: 6,
        host: "localhost",
        visited_at: 2342376243236,
        duration: 2000
      }, {
        id: 7,
        host: "www.heise.de",
        visited_at: 1234237243236,
        duration: 3000
      }, {
        id: 8,
        host: "www.spiegel.de",
        visited_at: 1342376243236,
        duration: 1000
      }, {
        id: 9,
        host: "",
        visited_at: 1242376243236,
        duration: 2000
      }, {
        id: 10,
        host: "",
        visited_at: 1234236243236,
        duration: 2000
      }]
    };
  });
}
