import { HereModal } from "./HereModal";
import { WaitlistProviderUserName } from "./WaitlistProviderUserName";

export const successModal = new HereModal('success-modal')

export class WaitlistModal extends HereModal {
  constructor() {
    super("waitlist-join")
    this.provider = new WaitlistProviderUserName("#waitlist-join");
    this.provider.onSubmit = () => {
      this.close();
      successModal.open();
    };
  }
}