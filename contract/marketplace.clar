(use-trait nft-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait.nft-trait)

(define-data-var owner principal tx-sender)
(define-map listings uint {price: uint, seller: principal})
(define-map bids uint {bidder: principal, amount: uint})
(define-constant FEE_PERCENTAGE u5) ;; 5% marketplace fee

(define-public (list-nft (nft-contract <nft-trait>) (token-id uint) (price uint))
  (begin
    (let ((nft-owner (unwrap! (contract-call? nft-contract get-owner token-id) (err u404))))
      (asserts! (is-some nft-owner) (err u404))  ;; Check if owner exists
      (asserts! (is-eq tx-sender (unwrap-panic nft-owner)) (err u401))  ;; Unwrap the optional
      (map-set listings token-id {price: price, seller: tx-sender})
      (ok true)
    )
  )
)

(define-public (buy-nft (nft-contract <nft-trait>) (token-id uint))
  (let ((listing (unwrap! (map-get? listings token-id) (err u404))))
    (asserts! (>= (stx-get-balance tx-sender) (get price listing)) (err u402))
    (try! (stx-transfer? (get price listing) tx-sender (get seller listing)))
    (try! (contract-call? nft-contract transfer token-id (get seller listing) tx-sender))
    (map-delete listings token-id)
    (ok true)
  )
)

(define-public (place-bid (nft-contract <nft-trait>) (token-id uint) (amount uint))
  (begin
    (asserts! (>= (stx-get-balance tx-sender) amount) (err u402))
    (map-set bids token-id {bidder: tx-sender, amount: amount})
    (ok true)
  )
)

(define-public (accept-bid (nft-contract <nft-trait>) (token-id uint))
  (let ((bid (unwrap! (map-get? bids token-id) (err u404)))
        (nft-owner (unwrap! (contract-call? nft-contract get-owner token-id) (err u404))))
    (asserts! (is-some nft-owner) (err u404))  ;; Check if owner exists
    (asserts! (is-eq tx-sender (unwrap-panic nft-owner)) (err u401))  ;; Unwrap the optional
    (try! (stx-transfer? (get amount bid) (get bidder bid) tx-sender))
    (try! (contract-call? nft-contract transfer token-id tx-sender (get bidder bid)))
    (map-delete bids token-id)
    (map-delete listings token-id)
    (ok true)
  )
)

(define-public (cancel-listing (token-id uint))
  (let ((listing (unwrap! (map-get? listings token-id) (err u404))))
    (asserts! (is-eq tx-sender (get seller listing)) (err u401))
    (map-delete listings token-id)
    (ok true)
  )
)

(define-public (withdraw-bid (token-id uint))
  (let ((bid (unwrap! (map-get? bids token-id) (err u404))))
    (asserts! (is-eq tx-sender (get bidder bid)) (err u401))
    (map-delete bids token-id)
    (ok true)
  )
)