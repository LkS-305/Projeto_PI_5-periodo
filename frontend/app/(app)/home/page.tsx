"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useHomeHub } from "@/components/app-shell/HomeHubContext";
import { ROUTES } from "@/lib/routes";
import "./home.css";

type TileProps = {
  title: string;
  description: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  onClick: () => void;
  variant?: "featured" | "compact";
};

function HubTile({
  title,
  description,
  iconSrc,
  iconWidth,
  iconHeight,
  onClick,
  variant = "compact",
}: TileProps) {
  return (
    <button
      type="button"
      className={`home-tile home-tile--${variant}`}
      onClick={onClick}
    >
      <span className="home-tile__icon-wrap" aria-hidden>
        <Image
          src={iconSrc}
          alt=""
          width={iconWidth}
          height={iconHeight}
          className="home-tile__icon"
        />
      </span>
      <span className="home-tile__body">
        <span className="home-tile__title">{title}</span>
        <span className="home-tile__desc">{description}</span>
      </span>
      <span className="home-tile__chevron" aria-hidden />
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const homeHub = useHomeHub();

  if (!homeHub) {
    return null;
  }

  const { activeTab, tabVisible } = homeHub;
  const goCarteira = () =>
    router.push(
      `${ROUTES.dashboard}?papel=${activeTab === "profissional" ? "prestador" : "cliente"}`,
    );
  const goHistoricoServicos = () => router.push(ROUTES.servicosHistorico);

  return (
    <div className="home-page">
      <div className="home-hub__scroll">
        <header className="home-hub__welcome">
          {activeTab === "contratante" ? (
            <>
              <p className="home-hub__eyebrow">Hub DOMI</p>
              <h1 className="home-hub__title home-hub__title--compact">
                O que precisa hoje?
              </h1>
              <p className="home-hub__subtitle home-hub__subtitle--compact">
                Abra um atalho para demanda inteligente, contratos, catálogo ou
                carteira.
              </p>
            </>
          ) : (
            <>
              <p className="home-hub__eyebrow">Modo profissional</p>
              <h1 className="home-hub__title">A sua área de trabalho</h1>
              <p className="home-hub__subtitle">
                Portfólio, pedidos de clientes, histórico, serviços em curso e
                carteira.
              </p>
            </>
          )}
        </header>

        <div className={`tab-content${tabVisible ? " visible" : ""}`}>
          {activeTab === "contratante" && (
            <section
              className="home-section home-section--hub"
              aria-label="Atalhos contratante"
            >
              <div className="home-tiles">
                <HubTile
                  variant="featured"
                  title="Demanda inteligente"
                  description="Descreva o que precisa — a DOMI sugere profissionais alinhados ao pedido."
                  iconSrc="/images/ticket.svg"
                  iconWidth={72}
                  iconHeight={72}
                  onClick={() => router.push(ROUTES.demand)}
                />
                <div className="home-tiles__row home-tiles__row--three">
                  <HubTile
                    title="Contratos"
                    description="Em curso e histórico"
                    iconSrc="/images/deal.svg"
                    iconWidth={64}
                    iconHeight={48}
                    onClick={() => router.push(ROUTES.contracts)}
                  />
                  <HubTile
                    title="Explorar"
                    description="Catálogo de profissionais"
                    iconSrc="/images/explore.svg"
                    iconWidth={56}
                    iconHeight={56}
                    onClick={() => router.push(ROUTES.explore)}
                  />
                  <HubTile
                    title="Carteira"
                    description="Cartão, recibos e histórico de pagamentos"
                    iconSrc="/images/wallet.svg"
                    iconWidth={56}
                    iconHeight={56}
                    onClick={goCarteira}
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === "profissional" && (
            <section
              className="home-section home-section--hub"
              aria-label="Atalhos profissional"
            >
              <div className="home-tiles">
                <HubTile
                  variant="featured"
                  title="Pedidos"
                  description="Pedidos enviados por clientes: aceite ou recuse aqui. Combine detalhes em Mensagens."
                  iconSrc="/images/calendar.svg"
                  iconWidth={72}
                  iconHeight={72}
                  onClick={() => router.push(ROUTES.bookings)}
                />
                <div className="home-tiles__row">
                  <HubTile
                    title="Portfólio"
                    description="Mostre trabalhos e fortaleça o seu perfil."
                    iconSrc="/images/portifolio.svg"
                    iconWidth={72}
                    iconHeight={48}
                    onClick={() => router.push(ROUTES.portifolio)}
                  />
                  <HubTile
                    title="Histórico"
                    description="Serviços antigos, concluídos ou encerrados."
                    iconSrc="/images/deal.svg"
                    iconWidth={64}
                    iconHeight={48}
                    onClick={goHistoricoServicos}
                  />
                </div>
                <div className="home-tiles__row">
                  <HubTile
                    title="Serviços"
                    description="Em andamento e ativos com clientes."
                    iconSrc="/images/puzzle.svg"
                    iconWidth={56}
                    iconHeight={56}
                    onClick={() => router.push(ROUTES.services)}
                  />
                  <HubTile
                    title="Carteira"
                    description="Saldo, dados bancários (mock) e recebimentos"
                    iconSrc="/images/wallet.svg"
                    iconWidth={56}
                    iconHeight={56}
                    onClick={goCarteira}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
