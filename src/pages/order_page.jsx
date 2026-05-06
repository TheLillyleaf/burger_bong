import { useState } from "react";
import { menu } from "../data/menu";
import BurgerCard from "../components/burger_card";
import OrderForm from "../components/order_form";
import ThemeToggle from "../components/theme_toggle";
import { use_theme } from "../use_theme";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function OrderPage() {
  const { theme, toggle_theme } = use_theme();
  const [name, set_name] = useState("");
  const [selected_burger, set_selected_burger] = useState(null);
  const [submitting, set_submitting] = useState(false);
  const [confirmation, set_confirmation] = useState(null);

  const can_order =
    name.trim().length > 0 && selected_burger !== null && !submitting;

  async function handle_submit(e) {
    e.preventDefault();
    if (!can_order) return;

    set_submitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), burger: selected_burger }),
      });

      if (!res.ok) throw new Error("Order failed");

      const burger_data = menu.find((b) => b.id === selected_burger);
      set_confirmation({
        name: name.trim(),
        burger: burger_data?.name ?? selected_burger,
      });
      set_selected_burger(null);
      setTimeout(() => set_confirmation(null), 4000);
    } catch {
      alert("Något gick fel. Försök igen.");
    } finally {
      set_submitting(false);
    }
  }

  return (
    <div className='order-page'>
      <header className='order-page__header'>
        <ThemeToggle
          theme={theme}
          on_toggle={toggle_theme}
        />
        <div>
          <div className='order-page__logo'>Nynäs Ängar Burgers🍔</div>
          <div className='order-page__subtitle'>
            Välj din burgare och beställ
          </div>
        </div>
        <div style={{ width: 36 }} />
      </header>

      <form
        className='order-page__body'
        onSubmit={handle_submit}
      >
        <OrderForm
          value={name}
          on_change={set_name}
        />

        <div>
          <p className='order-page__section-label'>Välj din burgare</p>
          <div className='burger-grid'>
            {menu.map((burger) => (
              <BurgerCard
                key={burger.id}
                burger={burger}
                selected={selected_burger === burger.id}
                on_select={set_selected_burger}
              />
            ))}
          </div>
        </div>

        <button
          type='submit'
          className='order-btn'
          disabled={!can_order}
        >
          {submitting ? "Beställer..." : "Beställ"}
        </button>
      </form>

      {confirmation && (
        <div className='confirmation'>
          <span className='confirmation__emoji'>🍔</span>
          <p className='confirmation__title'>Tack {confirmation.name}!</p>
          <p className='confirmation__subtitle'>
            Din {confirmation.burger} är på väg
          </p>
        </div>
      )}
    </div>
  );
}
