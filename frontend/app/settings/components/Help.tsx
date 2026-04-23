import "./help.css";

export default function Help() {
  return (
    <div className="settings-section-card">
      <h3 className="settings-section-card__title">Ajuda</h3>
      <p className="settings-section-card__text">
        Encontre respostas rápidas para problemas comuns e canais de suporte.
      </p>
      <ul className="settings-section-card__list">
        <li>Central de atendimento</li>
        <li>Perguntas frequentes</li>
        <li>Contato por email</li>
      </ul>
    </div>
  );
}
