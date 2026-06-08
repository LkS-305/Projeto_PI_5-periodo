"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CarteiraGateway } from "@/lib/gateways/CarteiraGateway";
import {
  parseCarteiraMetodos,
  stringifyMetodos,
  type CarteiraMetodosJson,
} from "@/lib/carteiraMetodos";
import type { Carteira } from "@/types/entities/carteira";
import type { Transacao } from "@/types/entities/transacao";
import "./CarteiraSections.css";

function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function transacaoEncerrada(t: Transacao): boolean {
  const s = String(t.status).toLowerCase();
  return s === "concluido" || s === "aprovada";
}

function isRecebimento(t: Transacao): boolean {
  const tipo = String(t.tipo).toLowerCase();
  return tipo === "receber" || tipo === "credito";
}

function labelTipo(t: Transacao): string {
  const tipo = String(t.tipo).toLowerCase();
  if (tipo === "enviar" || tipo === "debito") return "Pagamento";
  if (tipo === "receber" || tipo === "credito") return "Recebimento";
  return t.tipo;
}

type BaseProps = {
  userId: string;
  carteira: Carteira | null;
  transacoes: Transacao[];
  onAtualizado: () => void;
};

type TabKey = 0 | 1 | 2;

function CarteiraSliderTabs({
  labels,
  active,
  onSelect,
  idPrefix,
}: {
  labels: [string, string, string];
  active: TabKey;
  onSelect: (i: TabKey) => void;
  idPrefix: string;
}) {
  return (
    <div className="carteira-slider__tabs" role="tablist" aria-label="Secções da carteira">
      {labels.map((label, i) => {
        const idx = i as TabKey;
        const selected = active === idx;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${i}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${i}`}
            tabIndex={selected ? 0 : -1}
            className={`carteira-slider__tab${selected ? " carteira-slider__tab--active" : ""}`}
            onClick={() => onSelect(idx)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function CarteiraClienteView({
  userId,
  carteira,
  transacoes,
  onAtualizado,
}: BaseProps) {
  const [tab, setTab] = useState<TabKey>(0);

  const metodos = useMemo(
    () => parseCarteiraMetodos(carteira?.metodos_de_pagamento),
    [carteira?.metodos_de_pagamento],
  );

  const [nomeTitular, setNomeTitular] = useState("");
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const m = parseCarteiraMetodos(carteira?.metodos_de_pagamento);
    setNomeTitular(m.cartaoCadastro?.nomeTitular ?? "");
    setValidade(m.cartaoCadastro?.validade ?? "");
  }, [carteira?.metodos_de_pagamento]);

  const ultimosGuardados = metodos.cartaoCadastro?.ultimos4 ?? "";

  const salvarCartao = useCallback(async () => {
    setMsg(null);
    setErr(null);
    if (!carteira) {
      setErr(
        "Ainda não existe carteira associada à sua conta. Ela costuma ser criada após o primeiro pagamento na plataforma.",
      );
      return;
    }
    const digits = numero.replace(/\D/g, "");
    const ultimos4 =
      digits.length >= 4
        ? digits.slice(-4)
        : ultimosGuardados || (digits.length > 0 ? digits : "");

    if (!nomeTitular.trim() || !validade.trim() || ultimos4.length < 4) {
      setErr(
        "Preencha o nome como está no cartão, a validade e pelo menos os últimos 4 dígitos do número.",
      );
      return;
    }

    const next: CarteiraMetodosJson = {
      ...metodos,
      cartaoCadastro: {
        nomeTitular: nomeTitular.trim(),
        ultimos4,
        validade: validade.trim(),
      },
    };

    setSaving(true);
    try {
      await CarteiraGateway.updateMetodosPorConta(userId, stringifyMetodos(next));
      setNumero("");
      setMsg("Dados do cartão guardados na conta.");
      onAtualizado();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  }, [carteira, metodos, nomeTitular, numero, onAtualizado, userId, validade, ultimosGuardados]);

  const recibos = useMemo(
    () => transacoes.filter((t) => transacaoEncerrada(t)),
    [transacoes],
  );

  const labels: [string, string, string] = ["Cartão", "Comprovantes", "Histórico"];
  const slidePct = (tab * 100) / 3;

  return (
    <div className="carteira-flow">
      <header className="carteira-flow__intro">
        <h2 className="carteira-flow__title">Contratante</h2>
        <p className="carteira-flow__lead">
          Dados do cartão, comprovantes de operações concluídas e histórico de movimentos.
        </p>
      </header>

      <div className="carteira-slider">
        <CarteiraSliderTabs
          idPrefix="carteira-cli"
          labels={labels}
          active={tab}
          onSelect={setTab}
        />

        <div className="carteira-slider__viewport">
          <div
            className="carteira-slider__track"
            style={{ transform: `translateX(-${slidePct}%)` }}
          >
            <div
              className="carteira-slider__panel"
              id="carteira-cli-panel-0"
              role="tabpanel"
              aria-labelledby="carteira-cli-tab-0"
            >
              <section className="carteira-card" aria-labelledby="carteira-cartao-titulo">
                <h3 id="carteira-cartao-titulo" className="carteira-card__title">
                  Dados do cartão
                </h3>
                <p className="carteira-card__hint">
                  O código de segurança (CVV) não é armazenado. Guarde apenas dados necessários para
                  identificar o cartão na plataforma.
                </p>
                {ultimosGuardados ? (
                  <p className="carteira-card__badge">
                    Cartão registado · termina em <strong>{ultimosGuardados}</strong>
                    {metodos.cartaoCadastro?.validade ? (
                      <> · validade {metodos.cartaoCadastro.validade}</>
                    ) : null}
                  </p>
                ) : null}
                <div className="carteira-form-grid">
                  <label className="carteira-field">
                    <span>Nome no cartão</span>
                    <input
                      value={nomeTitular}
                      onChange={(e) => setNomeTitular(e.target.value)}
                      autoComplete="cc-name"
                      placeholder="Como impresso no cartão"
                    />
                  </label>
                  <label className="carteira-field">
                    <span>Número do cartão</span>
                    <input
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      autoComplete="cc-number"
                      placeholder={
                        ultimosGuardados
                          ? "•••• •••• •••• (opcional — para atualizar)"
                          : "•••• •••• •••• ••••"
                      }
                    />
                  </label>
                  <label className="carteira-field">
                    <span>Validade</span>
                    <input
                      value={validade}
                      onChange={(e) => setValidade(e.target.value)}
                      autoComplete="cc-exp"
                      placeholder="MM/AA"
                    />
                  </label>
                </div>
                {err ? <p className="carteira-msg carteira-msg--erro">{err}</p> : null}
                {msg ? <p className="carteira-msg carteira-msg--ok">{msg}</p> : null}
                <button
                  type="button"
                  className="carteira-btn-prim"
                  onClick={salvarCartao}
                  disabled={saving}
                >
                  {saving ? "A guardar…" : "Guardar dados do cartão"}
                </button>
              </section>
            </div>

            <div
              className="carteira-slider__panel"
              id="carteira-cli-panel-1"
              role="tabpanel"
              aria-labelledby="carteira-cli-tab-1"
            >
              <section className="carteira-card" aria-labelledby="carteira-recibos">
                <h3 id="carteira-recibos" className="carteira-card__title">
                  Recibos e comprovantes
                </h3>
                <p className="carteira-card__hint">
                  Transações concluídas — comprovativo simples para arquivo pessoal.
                </p>
                {recibos.length === 0 ? (
                  <p className="carteira-empty">
                    Ainda não há comprovantes — aparecem quando um pagamento for concluído.
                  </p>
                ) : (
                  <ul className="carteira-lista">
                    {recibos.map((t) => (
                      <li key={t.id} className="carteira-linha">
                        <div className="carteira-linha__meta">
                          <strong>{t.descricao || `Serviço ${t.servico_id}`}</strong>
                          <span className="carteira-linha__sub">
                            {new Date(t.created_at).toLocaleString("pt-BR")} ·{" "}
                            {t.metodo_pagamento}
                          </span>
                        </div>
                        <div className="carteira-linha__valor">{formatBRL(parseFloat(t.valor))}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <div
              className="carteira-slider__panel"
              id="carteira-cli-panel-2"
              role="tabpanel"
              aria-labelledby="carteira-cli-tab-2"
            >
              <section className="carteira-card" aria-labelledby="carteira-hist-cliente">
                <h3 id="carteira-hist-cliente" className="carteira-card__title">
                  Histórico de transações
                </h3>
                {transacoes.length === 0 ? (
                  <p className="carteira-empty">Sem movimentos nesta conta.</p>
                ) : (
                  <ul className="carteira-lista">
                    {transacoes.map((t) => (
                      <li key={t.id} className="carteira-linha">
                        <div className="carteira-linha__meta">
                          <strong>{labelTipo(t)}</strong>
                          <span className="carteira-linha__sub">
                            {t.descricao || `Serviço ${t.servico_id}`} · {String(t.status)}
                          </span>
                        </div>
                        <div className="carteira-linha__valor">{formatBRL(parseFloat(t.valor))}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CarteiraPrestadorView({
  userId,
  carteira,
  transacoes,
  onAtualizado,
}: BaseProps) {
  const [tab, setTab] = useState<TabKey>(0);

  const metodos = useMemo(
    () => parseCarteiraMetodos(carteira?.metodos_de_pagamento),
    [carteira?.metodos_de_pagamento],
  );

  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [tipoConta, setTipoConta] = useState("Corrente");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const m = parseCarteiraMetodos(carteira?.metodos_de_pagamento);
    setBanco(m.bancoMock?.banco ?? "");
    setAgencia(m.bancoMock?.agencia ?? "");
    setConta(m.bancoMock?.conta ?? "");
    setTipoConta(m.bancoMock?.tipoConta ?? "Corrente");
  }, [carteira?.metodos_de_pagamento]);

  const saldo = parseFloat(carteira?.saldo ?? "0");
  const bloqueado = parseFloat(carteira?.saldo_bloqueado ?? "0");
  const disponivel = saldo - bloqueado;

  const recebimentos = useMemo(() => transacoes.filter(isRecebimento), [transacoes]);

  const comprovantes = useMemo(
    () => recebimentos.filter((t) => transacaoEncerrada(t)),
    [recebimentos],
  );

  const salvarBancoMock = useCallback(async () => {
    setMsg(null);
    setErr(null);
    if (!carteira) {
      setErr("Carteira de prestador não encontrada.");
      return;
    }
    if (!banco.trim() || !agencia.trim() || !conta.trim()) {
      setErr("Preencha banco, agência e conta (simulação).");
      return;
    }
    const next: CarteiraMetodosJson = {
      ...metodos,
      bancoMock: {
        banco: banco.trim(),
        agencia: agencia.trim(),
        conta: conta.trim(),
        tipoConta: tipoConta.trim() || "Corrente",
      },
    };
    setSaving(true);
    try {
      await CarteiraGateway.updateMetodosPorConta(userId, stringifyMetodos(next));
      setMsg("Dados bancários (simulação) guardados apenas na aplicação de demonstração.");
      onAtualizado();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  }, [agencia, banco, carteira, conta, metodos, onAtualizado, tipoConta, userId]);

  const labels: [string, string, string] = ["Conta bancária", "Comprovantes", "Saldo e histórico"];
  const slidePct = (tab * 100) / 3;

  return (
    <div className="carteira-flow">
      <header className="carteira-flow__intro">
        <h2 className="carteira-flow__title">Profissional</h2>
        <p className="carteira-flow__lead">
          Conta para repasse (simulada), comprovantes de recebimentos e saldo com histórico.
        </p>
      </header>

      <div className="carteira-slider">
        <CarteiraSliderTabs
          idPrefix="carteira-prest"
          labels={labels}
          active={tab}
          onSelect={setTab}
        />

        <div className="carteira-slider__viewport">
          <div
            className="carteira-slider__track"
            style={{ transform: `translateX(-${slidePct}%)` }}
          >
            <div
              className="carteira-slider__panel"
              id="carteira-prest-panel-0"
              role="tabpanel"
              aria-labelledby="carteira-prest-tab-0"
            >
              <section className="carteira-card" aria-labelledby="carteira-banco-mock">
                <h3 id="carteira-banco-mock" className="carteira-card__title">
                  Dados da conta bancária (simulação)
                </h3>
                <p className="carteira-card__hint">
                  Integração real com banco ainda não está ligada — estes campos servem apenas para
                  demonstração da experiência do prestador.
                </p>
                <div className="carteira-form-grid carteira-form-grid--2">
                  <label className="carteira-field">
                    <span>Banco</span>
                    <input
                      value={banco}
                      onChange={(e) => setBanco(e.target.value)}
                      placeholder="Ex.: Banco mock 001"
                    />
                  </label>
                  <label className="carteira-field">
                    <span>Agência</span>
                    <input
                      value={agencia}
                      onChange={(e) => setAgencia(e.target.value)}
                      placeholder="0001"
                    />
                  </label>
                  <label className="carteira-field">
                    <span>Conta</span>
                    <input
                      value={conta}
                      onChange={(e) => setConta(e.target.value)}
                      placeholder="12345-6"
                    />
                  </label>
                  <label className="carteira-field">
                    <span>Tipo</span>
                    <select value={tipoConta} onChange={(e) => setTipoConta(e.target.value)}>
                      <option value="Corrente">Corrente</option>
                      <option value="Poupança">Poupança</option>
                      <option value="Pagamento">Pagamento</option>
                    </select>
                  </label>
                </div>
                {err ? <p className="carteira-msg carteira-msg--erro">{err}</p> : null}
                {msg ? <p className="carteira-msg carteira-msg--ok">{msg}</p> : null}
                <button
                  type="button"
                  className="carteira-btn-prim"
                  onClick={salvarBancoMock}
                  disabled={saving}
                >
                  {saving ? "A guardar…" : "Guardar dados bancários (mock)"}
                </button>
              </section>
            </div>

            <div
              className="carteira-slider__panel"
              id="carteira-prest-panel-1"
              role="tabpanel"
              aria-labelledby="carteira-prest-tab-1"
            >
              <section className="carteira-card" aria-labelledby="carteira-comp-prest">
                <h3 id="carteira-comp-prest" className="carteira-card__title">
                  Recibos e comprovantes
                </h3>
                <p className="carteira-card__hint">Recebimentos concluídos na plataforma.</p>
                {comprovantes.length === 0 ? (
                  <p className="carteira-empty">Ainda não há comprovantes de recebimento.</p>
                ) : (
                  <ul className="carteira-lista">
                    {comprovantes.map((t) => (
                      <li key={t.id} className="carteira-linha">
                        <div className="carteira-linha__meta">
                          <strong>{t.descricao || `Serviço ${t.servico_id}`}</strong>
                          <span className="carteira-linha__sub">
                            {new Date(t.created_at).toLocaleString("pt-BR")} · {String(t.status)}
                          </span>
                        </div>
                        <div className="carteira-linha__valor carteira-linha__valor--pos">
                          +{formatBRL(parseFloat(t.valor))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <div
              className="carteira-slider__panel"
              id="carteira-prest-panel-2"
              role="tabpanel"
              aria-labelledby="carteira-prest-tab-2"
            >
              <section
                className="carteira-card carteira-card--destaque"
                aria-labelledby="carteira-saldo-prest"
              >
                <h3 id="carteira-saldo-prest" className="carteira-card__title">
                  Saldo
                </h3>
                <div className="carteira-saldo-grid">
                  <div>
                    <p className="carteira-saldo-label">Saldo na carteira</p>
                    <p className="carteira-saldo-valor">{formatBRL(saldo)}</p>
                  </div>
                  <div>
                    <p className="carteira-saldo-label">Disponível (após bloqueios)</p>
                    <p className="carteira-saldo-valor carteira-saldo-valor--sec">
                      {formatBRL(disponivel)}
                    </p>
                    {bloqueado > 0 ? (
                      <p className="carteira-card__hint">Bloqueado: {formatBRL(bloqueado)}</p>
                    ) : null}
                  </div>
                </div>

                <h4 className="carteira-subsec">Histórico de recebimentos</h4>
                {recebimentos.length === 0 ? (
                  <p className="carteira-empty">Sem recebimentos registados ainda.</p>
                ) : (
                  <ul className="carteira-lista">
                    {recebimentos.map((t) => (
                      <li key={t.id} className="carteira-linha">
                        <div className="carteira-linha__meta">
                          <strong>{t.descricao || `Serviço ${t.servico_id}`}</strong>
                          <span className="carteira-linha__sub">
                            {new Date(t.created_at).toLocaleString("pt-BR")} · {String(t.status)}
                          </span>
                        </div>
                        <div className="carteira-linha__valor carteira-linha__valor--pos">
                          +{formatBRL(parseFloat(t.valor))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
