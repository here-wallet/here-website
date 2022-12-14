import { HereModal } from "./HereModal";
import { WaitlistProvider } from "./WaitlistProvider";

export const successModal = new HereModal('success-modal')

export class WaitlistModal extends HereModal {
  constructor() {
    super("waitlist-modal")
    this.provider = new WaitlistProvider("#waitlist-modal");
    this.provider.onSubmit = () => {
      this.close();
      successModal.open();
    };
  }
}
