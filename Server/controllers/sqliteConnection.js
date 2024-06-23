const {
  A_USENET,
  sequelize,
  insertQuery,
  browseQuery,
  bodyQuery,
} = require("../models/nntpMessage");

async function setupDatabase() {
  try {
    await A_USENET.sync();
    await sequelize.query(insertQuery);
    console.log("Database setup complete.");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

async function initializeApplication() {
  try {
    const settings = {
      btnTest: 194681,
      btnArticle: 194713,
      btnBody: 194717,
      btnHeader: 194723,
      btnNewNews: 194729,
      btnDate: 194767,
      btnSaveStream: 194749,
      btnShowUser: 194771,
    };

    console.log("tabMessages.tabVisible:", false);
    Object.keys(settings).forEach((btn) => {
      console.log(`${btn}.Visible:`, settings[btn] === 1);
    });

    console.log("pagMessage.ActivePage:", "tabBody");
    console.log("pagMain.ActivePage:", "tabSettings");
    console.log("btnConnect_Enabled:", true);

    await setupDatabase();

    const agroup = "example_group";
    const qryBrowseResult = await sequelize.query(browseQuery, {
      replacements: { agroup: agroup },
      type: sequelize.QueryTypes.SELECT,
    });
    console.log("Messages queried:", qryBrowseResult);

    const messageId = "123";
    const qryBodyResult = await sequelize.query(bodyQuery, {
      replacements: { agroup: agroup, id_mes: messageId },
      type: sequelize.QueryTypes.SELECT,
    });
    console.log("Message body queried:", qryBodyResult);

    await sequelize.close();
  } catch (error) {
    console.error("Error initializing application:", error);
  }
}

module.exports = {
  setupDatabase,
  initializeApplication,
};
