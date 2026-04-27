import "./delete-account.css";

export default function DeleteAccount() {
  return (
    <div className="settings-section-card settings-section-card--danger">
      <h3 className="settings-section-card__title">Excluir conta</h3>
      <p className="settings-section-card__text">
        Esta ação é permanente. Revise seus dados antes de confirmar a exclusão
        da conta.
      </p>
      <button type="button" className="settings-section-card__danger-btn">
        Excluir
      </button>
    </div>
  );
}
