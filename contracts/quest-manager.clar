;; Quest Manager Contract
(use-trait quest-token .quest-pulse-token.quest-pulse-token)

(define-constant err-invalid-quest (err u200))
(define-constant err-quest-expired (err u201))
(define-constant err-insufficient-stake (err u202))

(define-map quests
  { quest-id: uint }
  {
    creator: principal,
    title: (string-ascii 100),
    reward: uint,
    deadline: uint,
    completed: bool,
    stake-amount: uint
  }
)

(define-data-var quest-counter uint u0)

(define-public (create-quest (title (string-ascii 100)) (reward uint) (deadline uint) (stake-amount uint))
  (let ((quest-id (var-get quest-counter)))
    (begin
      (map-insert quests
        { quest-id: quest-id }
        {
          creator: tx-sender,
          title: title,
          reward: reward,
          deadline: deadline,
          completed: false,
          stake-amount: stake-amount
        }
      )
      (var-set quest-counter (+ quest-id u1))
      (ok quest-id)
    )
  )
)

(define-public (complete-quest (quest-id uint))
  (let ((quest (unwrap! (map-get? quests {quest-id: quest-id}) err-invalid-quest)))
    (begin
      (asserts! (< block-height (get deadline quest)) err-quest-expired)
      (map-set quests
        { quest-id: quest-id }
        (merge quest { completed: true })
      )
      (ok true)
    )
  )
)
