const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 2 });
const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
export const moeda = value => money.format(value);
export const percentual = value => value == null ? "—" : percent.format(value) + "%";
export const numero = value => number.format(value);

