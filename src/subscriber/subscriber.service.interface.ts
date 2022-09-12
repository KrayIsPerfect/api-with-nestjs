import CreateSubscriberDto from './dto/create.subscriber.dto';
import Subscriber from './subscriber.service';

interface SubscriberService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>
  // eslint-disable-next-line @typescript-eslint/ban-types
  getAllSubscribers(params: {}): Promise<{data: Subscriber[]}>
}

export default SubscriberService;