;; QuestPulse Token (QPT)
(define-fungible-token quest-pulse-token)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-insufficient-balance (err u101))

(define-data-var token-name (string-ascii 32) "QuestPulse Token")
(define-data-var token-symbol (string-ascii 10) "QPT")

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-owner-only)
    (ft-transfer? quest-pulse-token amount sender recipient)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? quest-pulse-token amount recipient)
  )
)
