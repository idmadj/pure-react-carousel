import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ButtonBack from '../ButtonBack';

import Store from '../../Store/Store';
import { CarouselProvider } from '../..';
import ButtonBackWithStore from '..';

configure({ adapter: new Adapter() });


describe('<ButtonBack />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ButtonBack currentSlide={1} step={1} carouselStore={{}} totalSlides={10} visibleSlides={1}>
        Hello
      </ButtonBack>,
    );
    expect(wrapper.exists()).toBe(true);
  });
  it('should be disabled if the currentSlide is 0', () => {
    const wrapper = shallow(
      <ButtonBack
        currentSlide={0}
        step={1}
        carouselStore={{}}
        totalSlides={10}
        visibleSlides={1}
      >
      Hello
      </ButtonBack>,
    );
    expect(wrapper.prop('disabled')).toBe(true);
  });
  it('should be disabled if the disabled prop is set manually, regardless of currentSlide', () => {
    const wrapper = shallow(
      <ButtonBack
        currentSlide={1}
        step={1}
        carouselStore={{}}
        totalSlides={10}
        visibleSlides={1}
        disabled
      >
      Hello
      </ButtonBack>,
    );
    expect(wrapper.prop('disabled')).toBe(true);
  });
  it('should subract the value of step from currentSlide when clicked.', () => {
    const mockStore = new Store({
      currentSlide: 4,
      step: 3,
    });

    const wrapper = mount(
      <ButtonBack
        currentSlide={4}
        step={3}
        totalSlides={10}
        visibleSlides={1}
        carouselStore={mockStore}
      >
      Hello
      </ButtonBack>,
    );
    wrapper.find('button').simulate('click');
    expect(mockStore.getStoreState().currentSlide).toBe(1);
  });
  it('should subract the value of step from currentSlide when clicked and infinite is true.', () => {
    const mockStore = new Store({
      currentSlide: 4,
      step: 3,
      totalSlides: 10,
      visibleSlides: 3,
    });

    const wrapper = mount(
      <ButtonBack
        infinite
        currentSlide={4}
        step={3}
        totalSlides={10}
        visibleSlides={3}
        carouselStore={mockStore}
      >
      back
      </ButtonBack>,
    );
    expect(wrapper.find('button').prop('disabled')).toBe(false);
    wrapper.find('button').simulate('click');
    expect(mockStore.getStoreState().currentSlide).toBe(1);
  });
  it('should set the current slide to last if clicked when on the first slide if infinite is true.', () => {
    const mockStore = new Store({
      currentSlide: 0,
      step: 3,
      totalSlides: 10,
      visibleSlides: 3,
    });

    const wrapper = mount(
      <ButtonBack
        infinite
        currentSlide={0}
        step={3}
        totalSlides={10}
        visibleSlides={3}
        carouselStore={mockStore}
      >
      Back
      </ButtonBack>,
    );
    expect(wrapper.find('button').prop('disabled')).toBe(false);
    wrapper.find('button').simulate('click');
    expect(mockStore.getStoreState().currentSlide).toBe(7);
  });
  it('should call an onClick function passed as a prop', () => {
    const mockStore = new Store({
      currentSlide: 4,
      step: 3,
    });

    const mockOnClick = jest.fn();

    const wrapper = mount(
      <ButtonBack
        currentSlide={4}
        step={3}
        carouselStore={mockStore}
        onClick={mockOnClick}
        totalSlides={10}
        visibleSlides={1}
      >
      Hello
      </ButtonBack>,
    );
    wrapper.find('button').simulate('click');
    expect(mockOnClick.mock.calls.length).toBe(1);
  });
  xit('should disable the button and change the slide to 0 if currentSlide - step <= 0', () => {
    const wrapper = mount((
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
        currentSlide={1}
        step={3}
      >
        <ButtonBackWithStore>Hello</ButtonBackWithStore>
      </CarouselProvider>
    ));

    expect(wrapper.instance().getStore().state.currentSlide).toBe(1);
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(wrapper.instance().getStore().state.currentSlide).toBe(0);
    expect(wrapper.find('button').prop('disabled')).toBe(true);
  });
  it('should pass through any classess and append them to the list of classnames', () => {
    const wrapper = shallow(
      <ButtonBack
        currentSlide={4}
        step={3}
        carouselStore={{}}
        totalSlides={10}
        visibleSlides={1}
        className="bob"
      >
      Hello
      </ButtonBack>,
    );
    const classes = wrapper.find('button').prop('className').split(' ');
    expect(classes[0]).toEqual('buttonBack');
    expect(classes[1]).toEqual('carousel__back-button');
    expect(classes[2]).toEqual('bob');
  });
  it('should pass through any props not consumed by the component', () => {
    const wrapper = shallow(
      <ButtonBack
        currentSlide={4}
        step={3}
        carouselStore={{}}
        totalSlides={10}
        visibleSlides={1}
        foo="bar"
      >
      Hello
      </ButtonBack>,
    );
    expect(wrapper.find('button').prop('foo')).toEqual('bar');
  });
  it('should pause autoplay when clicked', () => {
    const wrapper = mount(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
        currentSlide={1}
        step={3}
        isPlaying
      >
        <ButtonBackWithStore>Hello</ButtonBackWithStore>
      </CarouselProvider>,
    );
    wrapper.find('button').simulate('click');
    expect(wrapper.instance().getStore().state.isPlaying).toBe(false);
  });
  it('should use given tag instead of button', () => {
    const CustomButton = customProps => (<button type="button" {...customProps} />);
    const wrapper = shallow(
      <ButtonBack
        currentSlide={1}
        step={1}
        carouselStore={{}}
        totalSlides={10}
        visibleSlides={1}
        tag={CustomButton}
      >
      Hello
      </ButtonBack>,
    );
    expect(wrapper.find(CustomButton)).toBeTruthy();
  });
});
