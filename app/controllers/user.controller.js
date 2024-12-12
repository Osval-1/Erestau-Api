exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  if(req.originalUrl.startsWith("/v1.1/api")){
    res.status(200).send("User Content.");
  }else{
    res.status(429).json({ 
      msg: "Version deprecation. Please update to current version!",
      currentVersion: "1.0",
      updatedVersion: "1.1",
    });
  };
};

exports.adminBoard = (req, res) => {
  if(req.originalUrl.startsWith("/v1.1/api")){
    res.status(200).send("Admin Content.");
  }else{
    res.status(429).json({ 
      msg: "Version deprecation. Please update to current version!",
      currentVersion: "1.0",
      updatedVersion: "1.1",
    });
  };
};

exports.restaurantBoard = (req, res) => {
  if(req.originalUrl.startsWith("/v1.1/api")){
    res.status(200).send("Restaurant Content.");
  }else{
    res.status(429).json({ 
      msg: "Version deprecation. Please update to current version!",
      currentVersion: "1.0",
      updatedVersion: "1.1",
    });
  };
};

exports.suspendAccount = (req, res) => {
  if(req.originalUrl.startsWith("/v1.1/api")){
    res.status(200).send("Suspended Content.");
  }else{
    res.status(429).json({ 
      msg: "Version deprecation. Please update to current version!",
      currentVersion: "1.0",
      updatedVersion: "1.1",
    });
  };
}

exports.unsuspendUser = (req, res) => {
  if(req.originalUrl.startsWith("/v1.1/api")){
    res.status(200).send("Unsuspended Content.");
  }else{
    res.status(429).json({ 
      msg: "Version deprecation. Please update to current version!",
      currentVersion: "1.0",
      updatedVersion: "1.1",
    });
  };
}