const yarnGrid = document.querySelector("#yarnGrid");

async function loadYarns() {
  try {
    const response = await fetch("./yarns.json");

    if (!response.ok) {
      throw new Error("Could not load yarns.json");
    }

    const yarns = await response.json();
    renderYarns(yarns);
  } catch (error) {
    yarnGrid.innerHTML = `
      <article class="yarn-card">
        <div class="yarn-image"></div>
        <h3>Yarn closet loading note</h3>
        <p class="yarn-meta">yarns.json을 불러오지 못했어요.</p>
        <p>로컬에서 파일을 직접 열면 fetch가 막힐 수 있어요. GitHub Pages에 올리면 정상 작동합니다.</p>
      </article>
    `;
    console.error(error);
  }
}

function renderYarns(yarns) {
  yarnGrid.innerHTML = yarns
    .map((yarn) => {
      const tags = yarn.mood
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join("");

      const imageStyle = yarn.image
        ? `background-image: linear-gradient(rgba(244,235,221,0.08), rgba(244,235,221,0.08)), url('${yarn.image}'); background-size: cover; background-position: center;`
        : `--card-color: ${yarn.color || "#8A8882"};`;

      return `
        <article class="yarn-card">
          <div class="yarn-image" style="${imageStyle}"></div>
          <h3>${yarn.brand}<br>${yarn.name}</h3>
          <p class="yarn-meta">${yarn.weight} · ${yarn.fiber}</p>
          <p>${yarn.note}</p>
          <div class="tag-row">${tags}</div>
        </article>
      `;
    })
    .join("");
}

loadYarns();