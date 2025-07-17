import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Crown, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreditsExhaustedModalProps {
    isOpen: boolean
    onClose: () => void
    creditsRemaining: number
    upgradeUrl?: string
}

export function CreditsExhaustedModal({ isOpen, onClose, creditsRemaining, upgradeUrl }: CreditsExhaustedModalProps) {
    const router = useRouter()

    const handleUpgrade = () => {
        if (upgradeUrl) {
            window.location.href = upgradeUrl
        } else {
            router.push('/pricing')
        }
    }

    const handleViewPricing = () => {
        router.push('/pricing')
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        Credits Exhausted
                    </DialogTitle>
                    <DialogDescription className="text-center py-4">
                        You have <span className="font-bold text-primary">{creditsRemaining} credits</span> remaining.
                        <br />
                        Upgrade your plan to continue generating amazing UI components!
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 rounded-lg p-4 my-4">
                    <h4 className="font-semibold mb-2">✨ Unlock Premium Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• More credits for UI generation</li>
                        <li>• Priority support</li>
                        <li>• Advanced customization options</li>
                        <li>• Export capabilities</li>
                    </ul>
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-2">
                    {upgradeUrl && (
                        <Button
                            onClick={handleUpgrade}
                            className="w-full flex items-center gap-2"
                        >
                            <CreditCard className="h-4 w-4" />
                            Upgrade Now
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={handleViewPricing}
                        className="w-full"
                    >
                        View Pricing Plans
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 