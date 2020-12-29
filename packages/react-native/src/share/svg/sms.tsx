import * as React from 'react';
import SvgIcon from '../../svg-icon';
import { px } from '../../helper';

const width = px(40);
const height = px(40);

const xml = `
<svg t="1609225198686" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1732" width=${width} height=${height}><path d="M532.292683 0C238.726909 0 0.02559 204.718113 0.02559 457.391443c0 150.160736 54.608557 273.042783 163.77449 361.788085v150.211915c0 40.943623 13.664934 54.608557 34.136745 54.608557a52.254298 52.254298 0 0 0 34.136746-13.664934l163.77449-95.603359a924.814074 924.814074 0 0 0 136.444622 13.716114c293.514594 0 491.323471-218.434226 491.323471-470.851659S778.261495 0 532.292683 0z m0 860.123151c-27.329868 0-95.552179-6.806877-122.830868-6.806878l-27.278688-6.806877-20.471812 13.664934-122.830867 68.273491v-143.302679l-27.278689-20.471811c-88.745302-75.080368-136.546981-184.246301-136.546981-307.077169 0-218.434226 204.718113-388.964414 464.198321-388.964415 197.962415 0 423.254698 163.77449 423.254698 388.964415-6.806877 231.894442-191.104358 402.578169-430.215114 402.578168zM273.068373 402.782887a61.415434 61.415434 0 1 0 43.451419 18.015194 62.131947 62.131947 0 0 0-43.451419-18.015194z m238.906037 0a61.415434 61.415434 0 1 0 43.45142 18.015194A62.131947 62.131947 0 0 0 511.820872 402.782887z m238.906038 0a61.415434 61.415434 0 1 0 43.451419 18.015194 62.131947 62.131947 0 0 0-43.40024-18.015194z" p-id="1733" fill="#6AD460"></path></svg>
`;

export default () => <SvgIcon xml={xml} width={width} height={height} />;
