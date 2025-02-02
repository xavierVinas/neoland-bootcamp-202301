import retrieveAuctionBids from "../logic/retrieve-auction-bids"
import { useEffect, useState, useContext } from "react"
import { useParams, } from "react-router-dom"
import Context from '../Context'
import Container from "../library/Container"
import bidAuction from "../logic/bid-auction"
import Button from "../library/Button"

function BidList({ price, bidRate, status }) {
    const { auctionId } = useParams()

    const { alert } = useContext(Context)

    const [bids, setBids] = useState()

    const loadAuctionBids = () => {
             try {
            retrieveAuctionBids(auctionId, sessionStorage.token, (error, bids) => {
                if (error) {
                    alert(error.message)

                    return
                }

                setBids(bids.reverse())
            })
        } catch (error) {
            alert(error.message)
        }
    }

    //     try {
    //         retrieveAuctionBids(sessionStorage.token, auctionId)
    //             .then(bids => {
    //                 setBids(bids.reverse())

    //             })
    //             .catch(error => {
    //                 alert(error.message)
    //             })
    //     } catch (error) {
    //         alert(error.message)


    //     }
    // }
   


    useEffect(() => {
        loadAuctionBids()

        const intervalId = setInterval(() => {

            loadAuctionBids()
        }, 4000)
        return () => clearInterval(intervalId)


    }, [])



    const handleBid = event => {
        event.preventDefault()

        const amount = parseInt(event.target.amount.value)

        try {
            bidAuction(sessionStorage.token, auctionId, amount, error => {
                if (error) {
                    alert(error.message)

                    return
                }

                loadAuctionBids()
            })
        } catch (error) {
            alert(error.message)
        }
    }

    if (bids) {
        const maxBidAmount = bids.reduce((max, bid) => {
            return bid.amount > max ? bid.amount : max
        }, price)

        const nextBidAmount = maxBidAmount + bidRate

        return <Container className=" sm: bg-gray-200 p-6 rounded  max-h-96 overflow-y-scroll shadow-2xl my-0">
            <h2 className="font-bold">Live Auctions</h2>
            {status === 'open' &&
                <Container TagName="form" onSubmit={handleBid} className=" sm:">
                    <input defaultValue={nextBidAmount} min={nextBidAmount} step={bidRate} className="sm: bg-gray-100  shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " type="number" name="amount" />
                    <Button type="submit">
                        Bid up</Button>
                </Container>}
            <Container TagName="ul" className="¨my-0">
                {bids.map((bid) => (
                    <li key={bid.id} className="sm: border-b border-gray-400 py-4">
                        <div className="sm: flex justify-between items-center">
                            <div>
                                <p className="sm: text-gray-500">Date: {new Date(bid.date).toLocaleString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
                                <p className="sm: text-gray-500">Name: {bid.user.name}</p>
                                <p className="sm: text-gray-500">Amount: <span className="font-bold">{bid.amount}</span> $</p>
                            </div>

                        </div>
                    </li>
                ))}
            </Container>
        </Container>

    } else return <></>
}
export default BidList