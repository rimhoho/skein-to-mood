const [basesResponse, stashResponse] = await Promise.all([
    fetch("./data/shop-yarn-bases.json"),
    fetch("./data/my-yarn-stash.json")
  ]);
  
  const bases = await basesResponse.json();
  const stash = await stashResponse.json();
  
  const basesById = Object.fromEntries(
    bases.map((base) => [base.id, base])
  );
  
  const enrichedStash = stash.map((item) => ({
    ...basesById[item.base_id],
    ...item
  }));