// import creatures from './creatures.js';
import fixtures from './hazards/index.js';
import getUnit from './getUnit.js';

export default hexagon;
function hexagon(tile, parent, state) {
    let { id, color, terrain, hazards, creature, damage } = tile;

    const container = document.createElement('div');
    const hex = document.createElement('div');
    const loc = document.createElement('div');
    const unit = document.createElement('div');
    const edges = document.createElement('div');

    terrain = /(null|undefined)/i.test(`${terrain}`) ? 'none' : terrain;
    terrain = typeof terrain === 'number' ? `elevation${terrain + 1}` : terrain;

    container.classList.add('container', terrain);
    loc.classList.add('location');
    unit.classList.add('unit');

    const creatureName = creature ? creature.toLowerCase() : 'no-creature';
    hex.classList.add('hex', creatureName, color);

    // fixtures are terrain descriptive graphics
    if (fixtures[terrain]) {
        container.innerHTML = fixtures[terrain]();
    }

    // hazards decorate the edge of the hex
    if (hazards && hazards[id]) {
        const edgeChildren = hazards[id]
            .map((edge, n) => {
                return edge
                    ? `<span class="edge index-${n + 1} type-${edge}"></span>`
                    : ``;
            })
            .join('');

        edges.innerHTML = `<div class="edges">${edgeChildren}</div>`;
    }

    const { top, left, width, height } = getPositionCoord(id);

    container.id = id.toUpperCase();
    container.style.top = `${top}px`;
    container.style.left = `${left}px`;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;

    // Unicode hexagon charater  "&#x2B22;";
    loc.innerHTML = `${id}`;
    unit.id = `${id}`;
    unit.innerHTML = getUnit(creature, damage, color);
    unit.onclick = e => handleOnClick(e, state);

    hex.append(edges);
    hex.append(loc);
    hex.append(unit);
    container.append(hex);
    parent.append(container);
}

function handleOnClick(e, state) {
    const id = e.currentTarget.id;
    if (!state.creatures) {
        window.history.back();
    }

    const unit = state.creatures.filter(creature => creature.latlong === id);
    if (!unit || unit.length !== 1 || !unit[0].element) return false;
    const elm = unit[0].element;
    document.location.href = elm.href;
}

function getPositionCoord(id, width = 109, height = 94) {
    const coords = {
        // offsetX, offsetY, count (no of hexes in column)
        A: [1, 3, 3],
        B: [2, 2, 4],
        C: [3, 1, 5],
        D: [4, 0, 6],
        E: [5, 1, 5],
        F: [6, 2, 4]
    };

    const key = id.replace(/\d+$/i, '');
    const index = Number(id.replace(/^[a-z]+/i, ''));
    const [offsetX, offsetY, count] = coords[key];

    const topMargin = 65;
    const leftMargin = 60;
    const overlap = 0.75;

    const top =
        topMargin + ((height / 2) * (offsetY - 1) + (count - index) * height);
    const left = leftMargin + width * (offsetX - 1) * overlap;

    // Unit selection of nearest neighbour relies on center point coords
    const centerXY = [left + width / 2, top + height / 2];

    return { top, left, width, height, centerXY };
}


// function colorToHex(colorName) {
//     if (/^#/.test(colorName)) return colorName;
//     return {
//         red: '#ce0000',
//         green: '#08a308',
//         blue: '#35afff',
//         black: '#3c3c3c',
//         brown: '#112233'
//     }[colorName];
// }
