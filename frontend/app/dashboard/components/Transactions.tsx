"use client";

import "./Transactions.css";

export default function Transactions() {
  return (
    <div className="transactions-root">
      <h2 className="transactions-title">Transações</h2>

      <div className="transactions-tabs">
        <button
          type="button"
          className="transactions-tab transactions-tab--active"
        >
          Pagamentos
        </button>
        <button type="button" className="transactions-tab">
          Repasses
        </button>
        <button type="button" className="transactions-tab">
          Todas as atividades
        </button>
      </div>

      <section className="transactions-hero">
        <h3 className="transactions-hero-title">Comece a receber pagamentos</h3>
        <p className="transactions-hero-text">
          Ative sua carteira DOMI para receber pelos serviços concluídos,
          acompanhar repasses em tempo real e ter previsao clara dos seus
          próximos recebimentos.
        </p>
        <button type="button" className="transactions-hero-btn">
          Comece já
        </button>
      </section>
    </div>
  );
}
