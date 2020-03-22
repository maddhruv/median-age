const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

(async () => {
  try {
    const res = await axios.get(
      "https://en.wikipedia.org/wiki/List_of_countries_by_median_age"
    );

    const html = await res.data;

    const $ = cheerio.load(html);

    const DATA = [];

    function extract(elem, index) {
      return $($(elem).children()[index])
        .text()
        .trim();
    }

    $(".sortable > tbody")
      .children()
      .each((i, elem) => {
        if (i > 0) {
          DATA.push({
            country: extract(elem, 0),
            rank: extract(elem, 1),
            median: extract(elem, 2),
            male: extract(elem, 3),
            female: extract(elem, 4)
          });
        }
      });

    await fs.writeFileSync(
      "./data.json",
      JSON.stringify(
        {
          data: DATA
        },
        null,
        2
      )
    );
  } catch (err) {
    console.error(err);
  }
})();
