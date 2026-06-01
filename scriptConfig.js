export const SCRIPT_CONFIG = {
  targetURL: "https://the-internet.herokuapp.com/download", // Replace with the target URL you want to run the script

  //In order to improve the performance on the script, I added this object to target on the page always the pdf we are looking for
  cssSelectors: {
    searchInput: "body",
    searchButton: ".example a[href='download/Jpeg_with_exif.jpeg']",
    pdfDonwloadLink: ".example a[href='download/Jpeg_with_exif.jpeg']",
  },

  // Added this timeout to prevent infinite action loops, and enforce the performance asked to the quest
  timeout: 6000,
};
